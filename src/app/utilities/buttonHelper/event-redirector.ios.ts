
export class EventRedirector extends NSObject {

    static ObjCExposedMethods = {
        "handleTap:": { returns: interop.types.void, params: [UIView.class()] }
    };

    receiver: any;

    updateEditorValue(editorView, newValue) {
      this.receiver.updateEditorValue(editorView, newValue);
    }

    "handleTap:"(sender) {
      this.receiver.iosHandleTap(sender);
    }
}
