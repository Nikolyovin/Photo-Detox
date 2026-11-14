import { useEffect, useState, useCallback } from "react";
import * as MediaLibrary from "expo-media-library";
import { Query, AssetField, MediaType } from "expo-media-library";
import { File } from "expo-file-system";
import { GalleryAsset } from "../types";

const PAGE_SIZE = 200;
const MAX_PHOTOS = 20000;

export const useGallery = () => {
  const [allPhotos, setAllPhotos] = useState<GalleryAsset[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadPhotos = useCallback(async () => {
    setIsLoading(true);
    try {
      const collected: GalleryAsset[] = [];
      let offset = 0;
      let hasMore = true;

      while (hasMore && collected.length < MAX_PHOTOS) {
        const assets = await new Query()
          .eq(AssetField.MEDIA_TYPE, MediaType.IMAGE)
          .limit(PAGE_SIZE)
          .offset(offset)
          .orderBy({ key: AssetField.CREATION_TIME, ascending: false })
          .exe();

        if (!assets || assets.length === 0) {
          hasMore = false;
          break;
        }

        const processed = await Promise.all(
          assets.map(async (asset) => {
            let uri = (asset as unknown as { uri?: string }).uri;
            if (!uri && typeof (asset as any).getUri === "function") {
              try {
                uri = await (asset as any).getUri();
              } catch {
                uri = "";
              }
            }
            if (!uri) return null;

            // ВАША СТАРАЯ ПРОВЕРКА: Отсеиваем файлы, которых нет на диске
            try {
              const file = new File(uri);
              if (!file.exists) return null;
            } catch (e) {
              return null;
            }

            return { ...asset, uri } as GalleryAsset;
          }),
        );

        collected.push(
          ...processed.filter((a): a is GalleryAsset => a !== null),
        );

        if (assets.length < PAGE_SIZE) {
          hasMore = false;
        } else {
          offset += PAGE_SIZE;
        }
      }

      setAllPhotos(collected);
    } catch (error) {
      console.error("Ошибка загрузки фото:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const askPermission = useCallback(async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === "granted") {
      setHasPermission(true);
      await loadPhotos();
    } else {
      setIsLoading(false);
    }
  }, [loadPhotos]);

  useEffect(() => {
    askPermission();
  }, [askPermission]);

  return { allPhotos, hasPermission, isLoading, askPermission, loadPhotos };
};
