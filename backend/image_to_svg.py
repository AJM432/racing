import vtracer

def png_to_svg(input_png: str, output_svg: str,
               colormode: str = "binary",
               mode: str = "spline"):
    """
    Convert a PNG to SVG via VTracer.
    
    Args:
      input_png: Path to source PNG file.
      output_svg: Path where SVG will be saved.
      colormode: 'binary' (B/W) or 'color' (multi-color).
      mode: 'spline', 'polygon', or 'pixel' tracing style.
    """
    vtracer.convert_image_to_svg_py(
        input_png,
        output_svg,
        colormode=colormode,
        hierarchical="stacked",
        mode=mode,
        filter_speckle=4,
        color_precision=6,
        layer_difference=16,
        corner_threshold=60,
        length_threshold=4.0,
        max_iterations=10,
        splice_threshold=45,
        path_precision=3
    )
    print(f"✅ Exported SVG to {output_svg}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 3:
        print("Usage: python png_to_svg_vtracer.py input.png output.svg")
    else:
        png_to_svg(sys.argv[1], sys.argv[2])
