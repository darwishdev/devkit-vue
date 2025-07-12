import Uppy, { UIPlugin, UIPluginOptions } from "@uppy/core";
import { TusBody } from "@uppy/tus";
import { h } from "preact";
import { InputUploadMeta } from "../inputs";

export type GalleryPluginOptions = UIPluginOptions & {
  baseUrl?: string;
  bucketName?: string;
  defaultSelected?: string[];
  fallbackImage?: string;
  listEndpoint: () => Promise<string[]>;
};
type GalleryPluginState = {
  images: string[];
  selected: Set<string>;
};
export default class GallerySelectPlugin extends UIPlugin<
  GalleryPluginOptions,
  InputUploadMeta,
  TusBody,
  GalleryPluginState
> {
  private icon: () => h.JSX.Element;
  private selectedImages = new Set<string>();
  constructor(
    uppy: Uppy<InputUploadMeta, TusBody>,
    opts: GalleryPluginOptions,
  ) {
    super(uppy, opts);
    this.id = "SelectGalleryPlugin";
    this.title = "gallery";

    const initialSelected = new Set<string>(opts.defaultSelected || []);
    this.setPluginState({
      images: [],
      selected: initialSelected,
    });
    this.opts = opts;
    this.icon = () =>
      h(
        "svg",
        {
          "aria-hidden": "true",
          focusable: "false",
          width: "32",
          height: "32",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        },
        [
          h("rect", { x: 3, y: 3, width: 18, height: 18, rx: 2, ry: 2 }),
          h("circle", { cx: 8.5, cy: 8.5, r: 1.5 }),
          h("path", { d: "M21 15l-5-5L5 21" }),
        ],
      );
    this.type = "acquirer"; // or 'acquirer' — controls where it shows in Dashboard
    // Bind for event handlers
    this.handleImageClick = this.handleImageClick.bind(this);
    this.handleSubmitGallery = this.handleSubmitGallery.bind(this);
  }
  // Called when user clicks a thumbnail
  private handleImageClick(url: string) {
    const { selected, images } = this.getPluginState();
    let newSelected = new Set(selected);
    const maxFiles = this.uppy.opts.restrictions?.maxNumberOfFiles;
    if (maxFiles === 1) {
      if (selected.has(url)) {
        newSelected = new Set(); // deselect all
      } else {
        newSelected = new Set([url]);
      }
    } else {
      if (newSelected.has(url)) {
        newSelected.delete(url);
      } else {
        newSelected.add(url);
      }
    }

    this.setPluginState({
      images,
      selected: newSelected,
    });
  }

  // Called when user clicks “Submit”
  private async handleSubmitGallery() {
    console.log("clicked");
    const { selected } = this.getPluginState();
    console.log("clicked", selected);
    for (const url of selected) {
      if (!url.length) continue;
      console.log("url is", url, this.opts.baseUrl);
      const fullSrc = this.opts.baseUrl ? `${this.opts.baseUrl}/${url}` : url;
      try {
        // 2) Derive a filename from the URL (e.g. “foo.jpg”)
        const parts = fullSrc.split("/");
        const name = parts[parts.length - 1] || undefined;
        if (!name) continue;
        console.log("name is", name);
        // // 3) Add it into Uppy

        const fileID = this.uppy.addFile({
          id: `${this.id}--${fullSrc}`, // must be unique
          name,
          type: "image/*",
          data: new Blob(),
          meta: {
            bucketName: this.opts.bucketName || "",
            isGallery: true,
            objectName: name,
            contentType: "image/*",
          },
          source: this.id,
          preview: fullSrc,
        });

        // — STEP 2: Immediately mark it as already‐complete. We set its status to “complete”
        //    and give it uploadURL so Dashboard shows the thumbnail from fullSrc.
        this.uppy.setFileState(fileID, {
          progress: {
            uploadStarted: Date.now(),
            uploadComplete: true,
            percentage: 100,
            bytesUploaded: 1,
            bytesTotal: 1,
          },
          isPaused: false,
          response: {
            status: 200,
            uploadURL: fullSrc,
          },
          // Hide any “progress bar”
          // Mark status “complete” so Uppy won’t attempt to upload it
          // Indicate where the “remote” file actually is, so Dashboard and Previews use it:
          uploadURL: fullSrc,
        });
        this.uppy.emit("upload-success", this.uppy.getFile(fileID), {
          status: 200,
        });
        console.log("holaahe");
        console.log(this.uppy.getFiles());
      } catch (err) {
        console.log("holaahe", err);
        this.uppy.log(
          `[${this.id}] error adding ${fullSrc}: ${(err as Error).message}`,
          "error",
        );
      }
    }

    // 4) Clear selection (optional)
    this.selectedImages.clear();

    // 5) Switch back to default Dashboard tab (e.g. “My Device”)
    //    If you have a different default plugin ID, replace 'MyDevice' accordingly.
    //    Dashboard plugin instance exposes setActiveTab(pluginId: string) to switch tabs.
    // if (dashboard && typeof dashboard.setActiveTab === 'function') {
    //   dashboard.setActiveTab('MyDevice')
    // }
  }
  render() {
    const { selected, images } = this.getPluginState();
    const { baseUrl, fallbackImage } = this.opts;
    const fallback = fallbackImage || "";

    return h("div", { style: "padding: 1rem; color: #333;" }, [
      h(
        "div",
        { style: "margin-bottom: 0.5rem; font-weight: bold;" },
        "Select images to add:",
      ),

      // Grid of thumbnails
      h(
        "div",
        {
          style:
            "display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 1rem;",
        },
        images.map((url) => {
          const fullSrc = baseUrl ? `${baseUrl}/${url}` : url;
          console.log("url is ", url);
          const isChecked = selected.has(url);

          return h(
            "div",
            {
              key: url,
              style: `
                  cursor: pointer;
                  border: ${isChecked ? "3px solid #0066FF" : "2px solid transparent"};
                  border-radius: 8px;
                  position: relative;
                  width: 100px;
                  height: 100px;
                `,
              onClick: () => this.handleImageClick(url),
            },
            [
              // The <img> itself
              h("img", {
                src: fullSrc,
                style:
                  "width: 100%; height: 100%; object-fit: cover; border-radius: 6px;",
                onError: (e: h.JSX.TargetedEvent<HTMLImageElement, Event>) => {
                  const img = e.currentTarget;
                  if (fallback && img.src !== fallback) {
                    img.src = fallback;
                  }
                },
              }),

              // ✓ badge if selected
              isChecked &&
                h(
                  "div",
                  {
                    style: `
                        position: absolute;
                        top: 4px;
                        right: 4px;
                        background: rgba(0, 102, 255, 0.8);
                        color: white;
                        width: 16px;
                        height: 16px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px;
                      `,
                  },
                  "✓",
                ),
            ],
          );
        }),
      ),

      // Submit button
      h(
        "a",
        {
          style: `
              padding: 0.5rem 1rem;
              background: #0066FF;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            `,
          onClick: this.handleSubmitGallery,
        },
        "Submit Selectedd",
      ),
    ]);
  }

  install() {
    // 1) Fetch the full image list once at startup:
    this.opts
      .listEndpoint()
      .then((resp) => {
        const images = resp;

        // 2) Intersect any initialSelected URLs with the actual images returned:
        const initialSelected = new Set(this.opts.defaultSelected || []);
        if (!initialSelected) return;
        console.log("intiiaiill", initialSelected);
        // 3) Update plugin state with fetched images and filtered selection:
        this.setPluginState({
          images,
          selected: initialSelected,
        });

        for (const url of initialSelected) {
          if (!url.length) {
            continue;
          }
          const fullSrc = this.opts.baseUrl
            ? `${this.opts.baseUrl}/${url}`
            : url;
          const parts = fullSrc.split("/");
          if (!parts.length) {
            continue;
          }
          const name = parts[parts.length - 1];
          const fileID = this.uppy.addFile({
            id: `${this.id}--${fullSrc}`,
            name,
            type: "image/*",
            meta: {
              bucketName: this.opts.bucketName || "",
              isGallery: true,
              isInitial: true,
              objectName: name,
              contentType: "image/*",
            },
            data: new Blob(),
            source: this.id,
            preview: fullSrc,
          });

          this.uppy.setFileState(fileID, {
            progress: {
              uploadStarted: Date.now(),
              uploadComplete: true,
              percentage: 100,
              bytesUploaded: 1,
              bytesTotal: 1,
            },
            isPaused: false,
            uploadURL: fullSrc,
            response: {
              status: 200,
              uploadURL: fullSrc,
            },
          });
        }
        // 4) For each URL in filteredSelected, add a “complete” file stub to Uppy:
      })
      .catch((err) => {
        this.uppy.log(
          `[${this.id}] listEndpoint error: ${(err as Error).message}`,
          "error",
        );
      });

    // (Do NOT call this.mount('Dashboard', this) when using Vue.)
  }

  uninstall() {
    this.unmount();
  }
}
