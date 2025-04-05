
interface Window {
  PE_Balloon?: {
    init: (config: {
      wrap_words: boolean;
      id_user: number;
      our_helper: boolean;
      balloon_video?: boolean;
      balloon_phrases?: boolean;
      balloon_form_words?: boolean;
    }) => void;
  };
  jQuery?: any;
  $?: any;
}
