import axios from 'axios'
axios.defaults.baseURL = 'https://panel.goadisyon.com/';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.common['Authorization'] = localStorage.getItem("token");
