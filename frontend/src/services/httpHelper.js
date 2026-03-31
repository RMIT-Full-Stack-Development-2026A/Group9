class HttpHelper {
  static async request(url, method = "GET", body = null, token = null) {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const config = { method, headers };
    if (body) config.body = JSON.stringify(body);

    const response = await fetch(url, config);
    const data = await response.json();
    
    return { data, status: response.status };
  }

  static post(url, body, token) { return this.request(url, "POST", body, token); }
}

export default HttpHelper;