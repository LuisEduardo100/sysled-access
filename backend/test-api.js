
const axios = require('axios');

const url = 'https://integration.sysled.com.br/n8n/api/?v_suprimentos_pedido_compra_itens=null';
const token = 'e4b6f9082f1b8a1f37ad5b56e637f3ec719ec8f0b6acdd093972f9c5bb29b9ed';

async function testApi() {
    try {
        console.log('Testing URL:', url);
        const response = await axios.get(url, {
            headers: { 'Authorization': token }
        });
        
        console.log('Status:', response.status);
        console.log('Is Array:', Array.isArray(response.data));
        if (Array.isArray(response.data)) {
            console.log('Count:', response.data.length);
            console.log('First Item:', response.data[0]);
        } else {
            console.log('Data:', response.data);
        }
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
             console.error('Response data:', error.response.data);
        }
    }
}

testApi();
