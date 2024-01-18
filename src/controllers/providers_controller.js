const db_connection = require('../../db_connection.js');
const { IsANumber } = require('../../helpers.js');

const getAllProviders = (req, res) => {

    const query = `select * from providers where is_active = 1 ORDER BY provider_id DESC`
    db_connection.query(query, (error, result) => {
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {
            return res.status(200).json({ message: `Success query`, data: result });
        }
    })
}
const getProviderById = (req, res) => {
    const providerId = req.params.providerId
    const query = `select * from providers where is_active = 1 and provider_id = ${providerId}`
    db_connection.query(query, (error, result) => {
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {
            return res.status(200).json({ message: `Success query`, data: result });
        }
    })

}
const createProvider = (req, res) => {
    console.log(req.body)
    const name = req.body.name;
    const rfc = req.body.rfc;
    const zipCode = req.body.zipCode;
    const adress = req.body.adress;
    const state = req.body.state;
    const city = req.body.city;
    const phoneNumber = req.body.phoneNumber;

    const query = `insert into providers (name,rfc,zip_code,adress,state,city,phone_number)
    values ('${name}','${rfc}','${zipCode}','${adress}','${state}','${city}','${phoneNumber}')`

    db_connection.query(query, (error, result) => {
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {
            return res.status(200).json({ message: `Provider created successfully` });
        }
    })
}
const updateProvider = (req, res) => {
    const providerId = req.params.providerId.trim();
    const name = req.body.name.trim();
    const rfc = req.body.rfc.trim();
    const zipCode = req.body.zipCode.trim();
    const adress = req.body.adress.trim();
    const state = req.body.state.trim();
    const city = req.body.city.trim();
    const phoneNumber = req.body.phoneNumber.trim();

    const query = `update providers set name='${name}',rfc='${rfc}',zip_code='${zipCode}',adress='${adress}',state='${state}',city='${city}',phone_number='${phoneNumber}' where provider_id = ${providerId}`

    db_connection.query(query, (error, result) => {
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {
            return res.status(200).json({ message: `Provider updated successfully` });
        }
    })
}



const deleteProvider = (req, res) => {

    const providerId = parseInt(req.params.providerId);

    const putInactiveProviderQuery = `update providers set is_active=0 where provider_id=${providerId}`
    db_connection.query(putInactiveProviderQuery, (error, result) => {
        if (error) {
            return res.status(500).json('Server Error: ' + error);
        } else {
            const noProviderIdQuery = `select provider_id from providers where name = '-'`
            db_connection.query(noProviderIdQuery, (error, result) => {
                if (error) {
                    return res.status(500).json('Server Error: ' + error);
                } else {
                    const noProviderId = result[0].provider_id
                    const changeToNoProviderIdQuery = `update products set provider_id=${noProviderId} where provider_id=${providerId}`
                    db_connection.query(changeToNoProviderIdQuery, (error, result) => {
                        if (error) {
                            return res.status(500).json('Server Error: ' + error);
                        } else {
                            return res.status(200).json({ message: `Provider deleted successfully and products related updated` });
                        }
                    })

                }
            })


        }
    })
}
   
  

module.exports =
{
    createProvider, updateProvider, deleteProvider,
    getAllProviders, getProviderById
}