import Divider from "@/components/ui/divider";

import { CursorEnhancerLayer, CursorEnhancerProvider } from "@/components/shared/cursorEnhancer";
import { CircleCursor, DotCursor, LabelCursor, SquareCursor } from "@/components/shared/cursorEnhancer/examples";

export default function Home() {
  return (
    <div className="flex flex-col gap-3">
      <CursorEnhancerProvider>

        <main>

          {/* ───────────────────────────────────────────── */}
          {/* HERO / EMPTY AREA (default cursor only) */}
          {/* ───────────────────────────────────────────── */}
          <section className="h-[1000px] bg-white flex items-center justify-center">
            Default Cursor Zone
          </section>

          {/* ───────────────────────────────────────────── */}
          {/* CIRCLE CURSOR */}
          {/* ───────────────────────────────────────────── */}
          <CursorEnhancerLayer enhance={<CircleCursor />}>
            <section className="h-[250px] flex items-center justify-center border">
              Circle Cursor Zone
            </section>
          </CursorEnhancerLayer>

          {/* ───────────────────────────────────────────── */}
          {/* SQUARE CURSOR */}
          {/* ───────────────────────────────────────────── */}
          <CursorEnhancerLayer enhance={<SquareCursor />}>
            <section className="h-[250px] flex items-center justify-center border">
              Square Cursor Zone
            </section>
          </CursorEnhancerLayer>

          {/* ───────────────────────────────────────────── */}
          {/* DOT CURSOR */}
          {/* ───────────────────────────────────────────── */}
          <CursorEnhancerLayer enhance={<DotCursor />}>
            <section className="h-[250px] flex items-center justify-center border">
              Dot Cursor Zone
            </section>
          </CursorEnhancerLayer>

          {/* ───────────────────────────────────────────── */}
          {/* LABEL CURSOR (VIEW) */}
          {/* ───────────────────────────────────────────── */}
          <CursorEnhancerLayer enhance={<LabelCursor label="View" />}>
            <section className="h-[250px] flex items-center justify-center border">
              Label Cursor: View
            </section>
          </CursorEnhancerLayer>

          {/* ───────────────────────────────────────────── */}
          {/* LABEL CURSOR (PLAY) */}
          {/* ───────────────────────────────────────────── */}
          <CursorEnhancerLayer enhance={<LabelCursor label="Play ▶" bg="#111" />}>
            <section className="h-[250px] flex items-center justify-center border bg-black text-white">
              Label Cursor: Play
            </section>
          </CursorEnhancerLayer>

          {/* ───────────────────────────────────────────── */}
          {/* BLEND MODE EFFECT */}
          {/* ───────────────────────────────────────────── */}
          <CursorEnhancerLayer
            enhance={<CircleCursor size={60} color="white" backgroundColor="white" blendMode="difference" />}
          >
            <section className="h-[250px] flex items-center justify-center bg-black text-white">
              Blend Mode Cursor Zone
            </section>
          </CursorEnhancerLayer>

          {/* ───────────────────────────────────────────── */}
          {/* MULTI CURSOR COMPOSITION */}
          {/* ───────────────────────────────────────────── */}
          <CursorEnhancerLayer
            enhance={
              <>
                <DotCursor size={6} color="#D85A30" />
                <CircleCursor size={50} color="#D85A30" />
              </>
            }
          >
            <section className="h-[250px] flex items-center justify-center border">
              Composed Cursor (Dot + Ring)
            </section>
          </CursorEnhancerLayer>

          {/* ───────────────────────────────────────────── */}
          {/* NORMAL UI SECTION */}
          {/* ───────────────────────────────────────────── */}
          <section className="h-[300px] relative flex items-center justify-center">
            Top Section
            <Divider color="black" />
          </section>

          <section className="h-[300px] flex items-center justify-center">
            Bottom Section
          </section>

        </main>
      </CursorEnhancerProvider>
    </div>
  );
}