import axios from "axios";

const API_BASE = "http://localhost:5000/api/github";

const findJwtToken = () => {
  for (const store of [localStorage, sessionStorage]) {
    for (let i = 0; i < store.length; i++) {
      const val = store.getItem(store.key(i));
      if (val && val.startsWith("eyJ") && val.split(".").length === 3) {
        return val.replace(/^"|"$/g, "");
      }
      try {
        const parsed = JSON.parse(val);
        const nested = parsed?.token || parsed?.access_token || parsed?.jwt;
        if (nested && nested.startsWith("eyJ")) return nested;
      } catch {}
    }
  }
  return null;
};

const getAuthConfig = () => {
  const token = findJwtToken();
  return {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  };
};

const handleErr = (err) => {
  const detail =
    err?.response?.data?.error ||
    err?.response?.data?.msg ||
    err?.message ||
    "Request failed";
  throw new Error(detail);
};

const connectFn = async (payload) => {
  try {
    const body = typeof payload === "string" ? { github_username: payload } : payload;
    const res = await axios.post(`${API_BASE}/connect`, body, getAuthConfig());
    return res.data;
  } catch (err) {
    handleErr(err);
  }
};

const disconnectFn = async () => {
  try {
    const res = await axios.delete(`${API_BASE}/disconnect`, getAuthConfig());
    return res.data;
  } catch (err) {
    handleErr(err);
  }
};

const statusFn = async () => {
  try {
    const res = await axios.get(`${API_BASE}/status`, getAuthConfig());
    return res.data;
  } catch (err) {
    handleErr(err);
  }
};

const reposFn = async () => {
  try {
    const res = await axios.get(`${API_BASE}/repositories`, getAuthConfig());
    return res.data;
  } catch (err) {
    handleErr(err);
  }
};

const commitsFn = async (owner, repo) => {
  try {
    const res = await axios.get(
      `${API_BASE}/repositories/${owner}/${repo}/commits`,
      getAuthConfig()
    );
    return res.data;
  } catch (err) {
    handleErr(err);
  }
};

const issuesFn = async () => {
  try {
    const res = await axios.get(`${API_BASE}/issues`, getAuthConfig());
    return res.data;
  } catch (err) {
    handleErr(err);
  }
};

const pullsFn = async () => {
  try {
    const res = await axios.get(`${API_BASE}/pulls`, getAuthConfig());
    return res.data;
  } catch (err) {
    handleErr(err);
  }
};

export const githubService = {
  getStatus: statusFn,
  connect: connectFn,
  connectAccount: connectFn,
  disconnect: disconnectFn,
  disconnectAccount: disconnectFn,
  getRepositories: reposFn,
  getRepoCommits: commitsFn,
  getCommits: commitsFn,
  getIssues: issuesFn,
  getPullRequests: pullsFn,
};

export default githubService;
