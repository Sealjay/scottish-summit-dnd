import os
import logging
from azure.core.credentials import AzureKeyCredential
from azure.search.documents import SearchClient
from azure.search.documents.indexes import SearchIndexClient
from azure.search.documents.indexes.models import (
    SearchIndex,
    SimpleField,
    SearchableField,
    SearchFieldDataType,
    IndexingParameters,
    FieldMapping,
    InputFieldMappingEntry,
    OutputFieldMappingEntry,
    SearchIndexerSkillset,
    OcrSkill,
    MergeSkill,
)

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Azure AI Search configuration
search_endpoint = os.getenv("AZURE_AI_SEARCH_ENDPOINT")
search_key = os.getenv("AZURE_AI_SEARCH_KEY")
index_name = os.getenv("AZURE_SEARCH_INDEX_NAME", "srd_ogl_v51_index")
data_source_name = os.getenv("AZURE_SEARCH_DATA_SOURCE_NAME", "srd-ogl-v51-blob")
skillset_name = os.getenv("AZURE_SEARCH_SKILLSET_NAME", "srd-ogl-v51-skillset")
indexer_name = os.getenv("AZURE_SEARCH_INDEXER_NAME", "srd-ogl-v51-indexer")

# Initialize the search clients
search_client = SearchClient(search_endpoint, index_name, AzureKeyCredential(search_key))
index_client = SearchIndexClient(search_endpoint, AzureKeyCredential(search_key))

def create_index():
    fields = [
        SimpleField(name="id", type=SearchFieldDataType.String, key=True),
        SearchableField(name="content", type=SearchFieldDataType.String, analyzer_name="en.lucene"),
        SimpleField(name="page_number", type=SearchFieldDataType.Int32),
        SearchableField(name="metadata_title", type=SearchFieldDataType.String, analyzer_name="en.lucene"),
        SearchableField(name="metadata_author", type=SearchFieldDataType.String, analyzer_name="en.lucene"),
        SimpleField(name="metadata_creation_date", type=SearchFieldDataType.DateTimeOffset),
    ]

    index = SearchIndex(name=index_name, fields=fields)
    index_client.create_or_update_index(index)
    logging.info(f"Index '{index_name}' created or updated")

def create_skillset():
    ocr_skill = OcrSkill(
        name="ocr_skill",
        description="Extract text from images",
        context="/document/normalized_images/*",
        default_language_code="en",
        should_detect_orientation=True,
        inputs=[
            InputFieldMappingEntry(name="image", source="/document/normalized_images/*")
        ],
        outputs=[
            OutputFieldMappingEntry(name="text", target_name="extracted_text")
        ]
    )

    merge_skill = MergeSkill(
        name="merge_skill",
        description="Merge extracted text with content",
        context="/document",
        inputs=[
            InputFieldMappingEntry(name="text", source="/document/content"),
            InputFieldMappingEntry(name="itemsToInsert", source="/document/normalized_images/*/extracted_text")
        ],
        outputs=[
            OutputFieldMappingEntry(name="mergedText", target_name="merged_content")
        ]
    )

    skillset = SearchIndexerSkillset(
        name=skillset_name,
        description="Skillset for SRD OGL v5.1 document extraction",
        skills=[ocr_skill, merge_skill]
    )

    index_client.create_or_update_skillset(skillset)
    logging.info(f"Skillset '{skillset_name}' created or updated")

def create_indexer():
    indexer = {
        "name": indexer_name,
        "dataSourceName": data_source_name,
        "targetIndexName": index_name,
        "skillsetName": skillset_name,
        "parameters": {
            "configuration": {
                "dataToExtract": "contentAndMetadata",
                "imageAction": "generateNormalizedImages"
            }
        },
        "fieldMappings": [
            FieldMapping(source_field_name="/document/merged_content", target_field_name="content"),
            FieldMapping(source_field_name="/document/metadata/title", target_field_name="metadata_title"),
            FieldMapping(source_field_name="/document/metadata/author", target_field_name="metadata_author"),
            FieldMapping(source_field_name="/document/metadata/creation_date", target_field_name="metadata_creation_date"),
        ],
        "outputFieldMappings": [
            FieldMapping(source_field_name="/document/pages/*/number", target_field_name="page_number"),
        ]
    }

    index_client.create_or_update_indexer(indexer)
    logging.info(f"Indexer '{indexer_name}' created or updated")

def main():
    try:
        create_index()
        create_skillset()
        create_indexer()
        logging.info("Indexing setup completed successfully")
    except Exception as e:
        logging.error(f"An error occurred during the indexing setup process: {e}")

if __name__ == "__main__":
    main()
