# scottish-summit-dnd
> A repository for "Securing the Realm" - a D&D campaign set in a world where the players are the defenders of the realm.

[![Python](https://img.shields.io/badge/--3178C6?logo=python&logoColor=ffffff)](https://www.python.org/)
[![Azure](https://img.shields.io/badge/--3178C6?logo=microsoftazure&logoColor=ffffff)](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/?WT.mc_id=AI-MVP-5004204)

The slides from [Scottish Summit 2024](https://www.scottishsummit.com/) can be found here [Link to slides](Chris Lloyd-Jones & Josh McDonald - Securing the Realm.pdf).

## Overview
Dungeons & Dragons (D&D) has long thrived on the creativity and guidance of the Dungeon Master (DM), orchestrating adventures for players. Recent advancements in AI and large language models (LLMs) present a new opportunity: a DM-less D&D experience. This session focuses on the practical application of LLMs and SLMs to facilitate an autonomous, engaging tabletop RPG experience, allowing every player to take in the narrative.

We'll explore the technical architecture behind deploying LLMs and fine tuned SLMs for DM-less gameplay, emphasizing the integration of guardrails and memory systems for coherent storytelling. Key to this is maintaining a safe and immersive environment; so we'll also cover security measures such as red teaming and jailbreak prevention techniques that safeguard against exploits and ensure content appropriateness.

The technical overview will include audio inputs for voice and natural language understanding, enhancing player-AI interaction. Content generation by language models will be examined, demonstrating how AI can dynamically adapt stories, environments, and challenges in response to player actions.

## Creating a python venv
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## List of Demos
- DEMO1: [Link to ChatGPT](https://chatgpt.com/g/g-iPYbbC5Ft-securing-the-realm)
- DEMO2 - 3: Azure OpenAI + Basic chat interface; plus security features
- DEMO4: Azure OpenAI + Image generation
- DEMO5: Azure OpenAI + Image generation + Voice
- DEMO6: Azure OpenAI + Image generation + Voice + SLMs
### Not yet built
- DEMO7: Azure OpenAI + Image generation + Voice + SLMs + RAG v Finetuning
- DEMO8: Azure OpenAI + Image generation + Voice + SLMs + RAG v Finetuning + Memory

### Future
- 3D https://openai.com/index/point-e/
- Adaptive cards - https://learn.microsoft.com/en-us/adaptive-cards/ https://adaptivecards.io/
- Teams integration
- Agentic AI - improves token window, improves realism https://learn.microsoft.com/en-us/semantic-kernel/overview/


## Example of demo outputs
### Demos 2 & 3
![Demo 3](./assets/demo2and3.png)
### Demo 4
![Demo 4](./assets/demo4.png)
## Contributing
This repository uses [GitHub flow](https://guides.github.com/introduction/flow/).