package com.ductm.imagesPost.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ductm.imagesPost.entity.Image;

@Service
public class ImageSavingService {

	public List<String> saveToLocal(MultipartFile[] images) {
		Path path = Paths.get("frontend/src/assets/images");
		List<String> imageNames = new ArrayList<>();
		String saveName, originalName;
		for (MultipartFile f : images) {
			saveName = UUID.randomUUID().toString();
			originalName = f.getOriginalFilename();
			saveName += originalName.substring(originalName.lastIndexOf("."));

			try (InputStream fileInputStream = f.getInputStream()) {
				Files.copy(fileInputStream, path.resolve(saveName));
				imageNames.add(saveName);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return imageNames;
	}

	public void removeFromLocal(List<Image> images) {
		Path path = Paths.get("frontend/src/assets/images");
		for (Image image : images) {
			try {
				Files.deleteIfExists(path.resolve(image.getPath()));
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
	
	public void removeOneFromLocal(String image) {
		Path path = Paths.get("frontend/src/assets/images");
		try {
			Files.deleteIfExists(path.resolve(image));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
