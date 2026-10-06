import type { CharacterId } from "../types";

interface CharacterDefinition {
  id: CharacterId;
  name: string;
  modelPath: string;
  previewPath: string;
  callAudioPath: string;
}

export const CHARACTER_MODEL_SCALE = 0.2;
export const CHARACTER_ROAD_SURFACE_HEIGHT = 0.025;

export const CHARACTER_CATALOG: readonly CharacterDefinition[] = [
  {
    id: "cat",
    callAudioPath: `${import.meta.env.BASE_URL}audio/characters/cat.mp3`,
    name: "貓",
    modelPath: `${import.meta.env.BASE_URL}models/characters/animal-cat.glb`,
    previewPath: `${import.meta.env.BASE_URL}previews/characters/animal-cat.png`,
  },
  {
    id: "chicken",
    callAudioPath: `${import.meta.env.BASE_URL}audio/characters/chicken.mp3`,
    name: "小雞",
    modelPath: `${import.meta.env.BASE_URL}models/characters/animal-chick.glb`,
    previewPath: `${import.meta.env.BASE_URL}previews/characters/animal-chick.png`,
  },
  {
    id: "dog",
    callAudioPath: `${import.meta.env.BASE_URL}audio/characters/dog.mp3`,
    name: "狗",
    modelPath: `${import.meta.env.BASE_URL}models/characters/animal-dog.glb`,
    previewPath: `${import.meta.env.BASE_URL}previews/characters/animal-dog.png`,
  },
  {
    id: "pig",
    callAudioPath: `${import.meta.env.BASE_URL}audio/characters/pig.mp3`,
    name: "豬",
    modelPath: `${import.meta.env.BASE_URL}models/characters/animal-pig.glb`,
    previewPath: `${import.meta.env.BASE_URL}previews/characters/animal-pig.png`,
  },
  {
    id: "cow",
    callAudioPath: `${import.meta.env.BASE_URL}audio/characters/cow.mp3`,
    name: "牛",
    modelPath: `${import.meta.env.BASE_URL}models/characters/animal-cow.glb`,
    previewPath: `${import.meta.env.BASE_URL}previews/characters/animal-cow.png`,
  },
];

export function getCharacterDefinition(
  id: string,
): CharacterDefinition | undefined {
  return CHARACTER_CATALOG.find((character) => character.id === id);
}
