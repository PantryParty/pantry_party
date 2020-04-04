
export class EventRedirector {

    receiver: any;

    updateEditorValue(editorView, newValue) {
      this.receiver.updateEditorValue(editorView, newValue);
    }

    "handleTap:"(sender) {
      this.receiver.iosHandleTap(sender);
    }
}
