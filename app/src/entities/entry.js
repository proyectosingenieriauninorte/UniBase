class Entry {
    constructor(data) {
        this.entry_id = Date.now().toString();
        this.data = data;
    }
}

export default Entry;
