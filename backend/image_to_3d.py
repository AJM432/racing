import numpy as np
from PIL import Image
import trimesh
import sys

def png_to_glb(input_path, output_path, height_scale=10.0):
    # Load grayscale image
    img = Image.open(input_path).convert("L")
    heightmap = np.array(img, dtype=np.float32) / 255.0
    h, w = heightmap.shape

    # Generate vertices
    vertices = []
    for y in range(h):
        for x in range(w):
            z = heightmap[y, x] * height_scale
            vertices.append([x, -y, z])  # -y flips vertically

    vertices = np.array(vertices)

    # Generate faces (two triangles per quad)
    faces = []
    def idx(x, y): return y * w + x

    for y in range(h - 1):
        for x in range(w - 1):
            faces.append([idx(x, y), idx(x+1, y), idx(x, y+1)])
            faces.append([idx(x+1, y), idx(x+1, y+1), idx(x, y+1)])

    faces = np.array(faces)

    # Build mesh
    mesh = trimesh.Trimesh(vertices=vertices, faces=faces, process=True)

    # Export to GLB
    mesh.export(output_path)
    print(f"✅ Exported mesh to {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python png_to_glb.py input.png output.glb")
    else:
        png_to_glb(sys.argv[1], sys.argv[2])
