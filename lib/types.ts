export type PaletteColor = { name: string; hex: string };

export type Concept = {
  title: string;
  concept: string;
  palette: PaletteColor[];
  materials: string[];
  signature_pieces: string[];
  designer_note: string;
};

export type Enquiry = {
  id: string;
  created_at: string;
  name: string | null;
  email: string | null;
  project_type: string | null;
  message: string | null;
  ai_reply: string | null;
  ai_summary: string | null;
  ai_scope: string | null;
  ai_priority: string | null;
  ai_next_step: string | null;
};

export type ConceptRow = Concept & {
  id: string;
  created_at: string;
  room: string;
  style: string;
  brief: string | null;
};
