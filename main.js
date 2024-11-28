import InlineEditor from "./inlineEditor/inlineEditor.js";

let inlineTextEditor;
function openTextEditor(lbl) {
    if(!inlineTextEditor) inlineTextEditor = new InlineEditor(lbl);
    inlineTextEditor.generateTextEditor();
}

function closeTextEditor() {
    inlineTextEditor.destroy();
}

window.addEventListener("load", () => {
   const input_lbls = document.querySelectorAll("#input-div");
   input_lbls.forEach(lbl => {
      lbl.addEventListener("focusin", () => {
          openTextEditor(lbl);
      });

      lbl.addEventListener("focusout", () => {
          closeTextEditor();
      });

      document.addEventListener('mouseup', () => {
          if( !inlineTextEditor || !inlineTextEditor.isOpen ) return;
          inlineTextEditor.handleActiveOptions();
      });

      document.addEventListener('keyup', (e) => {
          if (!inlineTextEditor || !inlineTextEditor.isOpen) return;

          // Check if the key is ArrowLeft or ArrowRight
          if (e.code === "ArrowLeft" || e.code === "ArrowRight") {
              inlineTextEditor.handleActiveOptions();
          }
      });
   });
});
