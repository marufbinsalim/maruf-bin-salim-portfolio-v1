import Divider from "@/components/ui/divider";

import { CursorEnhancerLayer } from "@/components/shared/cursorEnhancer";
import { CircleCursor } from "@/components/shared/cursorEnhancer/examples";

export default function Home() {
  return (
    <CursorEnhancerLayer enhance={<CircleCursor size={15} color="red" />}>
      <div className="h-[1000px] bg-gray-300 text-white mt-16 w-full">
        Should be red
      </div>
      <div className="flex flex-col h-svh border bg-black">
        <CursorEnhancerLayer enhance={<CircleCursor size={15} color="blue" />}>
          <div className="h-[1000px] bg-gray-300 text-white w-full">
            Should be blue
          </div>
          <div className="flex flex-col gap-3 h-svh border">
            <CursorEnhancerLayer enhance={<CircleCursor size={15} color="black" />}>
              <div className="flex flex-col gap-3 h-[300px] bg-blue-300 border">
                <p>
                  Should be black
                </p>
              </div>
              <div className="flex gap-10 flex-wrap">
              {
                ["red", "green", "blue", "yellow", "purple", "orange", "pink", "gray", "black"].map((color, index) => (
                  <CursorEnhancerLayer enhance={<CircleCursor size={15} color={color} />} key={index}>
                    <div className="flex flex-col gap-3 h-[40px] w-[100px] border">
                      <p>
                        Should be {color}
                      </p>
                    </div>
                  </CursorEnhancerLayer>
                ))
              }
              </div>
            </CursorEnhancerLayer>
          </div>
        </CursorEnhancerLayer>
        <div>
          Hello
        </div>
      </div>
    </CursorEnhancerLayer>

  );
}