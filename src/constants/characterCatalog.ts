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
    callAudioPath: "/audio/characters/cat.mp3",
    name: "貓",
    modelPath: "/models/characters/animal-cat.glb",
    previewPath: "/previews/characters/animal-cat.png",
  },
  {
    id: "chicken",
    callAudioPath: "/audio/characters/chicken.mp3",
    name: "小雞",
    modelPath: "/models/characters/animal-chick.glb",
    previewPath: "/previews/characters/animal-chick.png",
  },
  {
    id: "dog",
    callAudioPath: "/audio/characters/dog.mp3",
    name: "狗",
    modelPath: "/models/characters/animal-dog.glb",
    previewPath: "/previews/characters/animal-dog.png",
  },
  {
    id: "pig",
    callAudioPath: "/audio/characters/pig.mp3",
    name: "豬",
    modelPath: "/models/characters/animal-pig.glb",
    previewPath: "/previews/characters/animal-pig.png",
  },
  {
    id: "cow",
    callAudioPath: "/audio/characters/cow.mp3",
    name: "牛",
    modelPath: "/models/characters/animal-cow.glb",
    previewPath: "/previews/characters/animal-cow.png",
  },
];

export function getCharacterDefinition(
  id: string,
): CharacterDefinition | undefined {
  return CHARACTER_CATALOG.find((character) => character.id === id);
}
