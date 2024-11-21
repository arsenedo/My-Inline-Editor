import InlineEditor from "./inlineEditor/inlineEditor.js";

let inlineTextEditor;
function openTextEditor(lbl) {
    inlineTextEditor = new InlineEditor(lbl);
    inlineTextEditor.generateTextEditor();
}

function closeTextEditor() {
    inlineTextEditor.destroy();
}


window.addEventListener("load", () => {
   const input_lbls = document.querySelectorAll(".input-lbl");
   input_lbls.forEach(lbl => {
      lbl.addEventListener("focusin", (e) => {
          openTextEditor(lbl);
      });

      lbl.addEventListener("focusout", (e) => {
          closeTextEditor();
      })
   });
});
