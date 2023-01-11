import axios from 'axios';

const baseUrl = '/api/persons/';

const create = (object) => axios.post(baseUrl, object).then(response => response.data);

const getAll = () => axios.get(baseUrl).then(response => response.data);

const remove = (id) => axios.delete(baseUrl + id).then(response => response.data);

const update = (id, object) => axios.put(baseUrl + id, object).then(response => response.data);

export default {create, getAll, remove, update};