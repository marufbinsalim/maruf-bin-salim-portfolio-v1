"use client";

import { CursorFadingLineTrail } from "@/components/shared/custom-cursor-trails/cursor-fading-line-trail";
import { CursorCircularTrail, CursorTrailArea } from "cursor-trail-react";

export default function Home() {
  return (
    <CursorTrailArea.div trail={<CursorFadingLineTrail color="black" />}>
      <div className="h-[1000px] bg-gray-300 text-white mt-16 w-full">
        Should be black
      </div>
      <div className="flex flex-col h-svh border bg-black">
        <CursorTrailArea.div trail={<CursorCircularTrail color="blue" />}>
          <div className="h-[1000px] bg-gray-300 text-white w-full">
            Should be blue
          </div>
          <div className="flex flex-col gap-3 h-svh border">
            <CursorTrailArea.div trail={<CursorCircularTrail color="black" />}>
              <div className="flex flex-col gap-3 h-[300px] bg-blue-300 border">
                <p data-cursor="active"> 
                  Should be black
                </p>
              </div>
              <div className="flex gap-10 flex-wrap">
              {
                ["red", "green", "blue", "yellow", "purple", "orange", "pink", "gray", "black"].map((color, index) => (
                  <CursorTrailArea.div trail={<CursorCircularTrail color={color} />} key={index}>
                    <div className="flex flex-col gap-3 h-[40px] w-[100px] border">
                      <p>
                        Should be {color}
                      </p>
                    </div>
                  </CursorTrailArea.div>
                ))
              }
              </div>
            </CursorTrailArea.div>
          </div>
        </CursorTrailArea.div>
        <div>
          Hello
        </div>
      </div>
    </CursorTrailArea.div>

  );
}