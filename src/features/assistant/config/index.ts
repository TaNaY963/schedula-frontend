import { doctorAssistantConfig } from "./doctor-config";
import { patientAssistantConfig } from "./patient-config";
import { publicAssistantConfig } from "./public-config";

import type { AssistantConfig, AssistantMode } from "../types";

export function getAssistantConfig(mode: AssistantMode): AssistantConfig {
  switch (mode) {
    case "patient":
      return patientAssistantConfig;
    case "doctor":
      return doctorAssistantConfig;
    default:
      return publicAssistantConfig;
  }
}
