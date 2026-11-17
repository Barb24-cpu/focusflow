
import api from './api';

const githubService = {

    async connectAccount(token) {
        const response = await api.post('/github/connect', { token });

        return response.data;
    },

    async disconnectAccount() {
        const response = await api.delete('/github/disconnect');

        return response.data;
    },

    async getRepositories() {
        const response = await api.get('/github/repositories');

        return response.data;
    },

    async getRepoCommits(owner, repo) {
        const response = await api.get(
            `/github/repositories/${owner}/${repo}/commits`
        );

        return response.data;
    },

    async getIssues() {
        const response = await api.get('/github/issues');

        return response.data;
    },

    async getPullRequests() {
        const response = await api.get('/github/pulls');

        return response.data;
    },

};

export default githubService;
