class apiFetch {
  constructor() {
    this.count = 0;
  }
  async getAPI(apiURL) {
    try {
      let result = await fetch(apiURL);
      console.log(result);
    } catch (error) {
      if (this.count < 2) {
        this.count = this.count + 1;
        return setTimeout(this.getAPI(apiURL), 5000);
      }
      return error;
    }
  }
}

export default apiFetch;
