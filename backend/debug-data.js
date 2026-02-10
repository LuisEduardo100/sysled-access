
const axios = require('axios');

const token = 'e4b6f9082f1b8a1f37ad5b56e637f3ec719ec8f0b6acdd093972f9c5bb29b9ed';

async function debugData() {
    try {
        // 1. Fetch Suprimentos to check date format
        console.log('Fetching Suprimentos...');
        const supResponse = await axios.get('https://integration.sysled.com.br/n8n/api/?v_suprimentos_pendencia_compra_ativas=null', {
            headers: { 'Authorization': token }
        });
        
        if (Array.isArray(supResponse.data) && supResponse.data.length > 0) {
            const item = supResponse.data[0];
            console.log('Sample Suprimento Item:', {
                dataPendencia: item.dataPendencia,
                dataPedido: item.dataPedido,
                codigo_sku: item.codigo_sku
            });
        }

        // 2. Test Stock Endpoint
        const skuToTest = '20451'; // From user example
        console.log(`Testing Stock for SKU ${skuToTest}...`);
        const stockResponse = await axios.get(`https://integration.sysled.com.br/n8n/api/?v_estoque_consulta_sku=null&codigoSku=${skuToTest}`, {
            headers: { 'Authorization': token }
        });
        console.log('Stock Response:', stockResponse.data);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

debugData();
