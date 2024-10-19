export interface Message {
  role: string;
  content: string;
  type: string;
  contentSafety: boolean;
}
