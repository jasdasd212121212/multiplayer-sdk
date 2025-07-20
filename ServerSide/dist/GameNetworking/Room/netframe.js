class netframe {
    constructor() {
        this.netBuffer = new Array(5000);
        this.currentFrameSize = 0;
        for (let i = 0; i < this.netBuffer.length; i++) {
            this.netBuffer[i] = new netframePiece();
        }
    }
    write(objects) {
        this.currentFrameSize = objects.length;
        for (let i = 0; i < this.currentFrameSize; i++) {
            this.netBuffer[i].set(objects[i].position, objects[i].rotation);
        }
    }
    filterOnlyUpdated(objects) {
        let result = [];
        for (let i = 0; i < this.currentFrameSize; i++) {
            let object = objects[i];
            let netFrame = this.netBuffer[i];
            if (object != null && object != undefined && i <= (objects.length - 1)) {
                if (!this.vectorEquals(object.position, netFrame.position) || !this.vectorEquals(object.rotation, netFrame.rotation)) {
                    result.push(object);
                }
            }
        }
        return result;
    }
    isEmpty() {
        return this.currentFrameSize == 0;
    }
    vectorEquals(left, right) {
        return left.x == right.x && left.y == right.y && left.z == right.z;
    }
}
class netframePiece {
    set(pos, rot) {
        this.position = pos;
        this.rotation = rot;
    }
}
export { netframe };
//# sourceMappingURL=netframe.js.map