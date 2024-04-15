const updateDogDetails = {
  specversion: '1.0',
  type: 'uk.gov.defra.ddi.event.update',
  source: 'aphw-ddi-portal',
  id: '7028ee25-babe-4213-9000-186c4da8df89',
  partitionKey: 'ED300001',
  time: '2024-04-12T10:27:40.632Z',
  subject: 'DDI Update dog',
  datacontenttype: 'text/json',
  data: {
    message: '{"actioningUser":{"username":"dev@test.com","displayname":"Developer"},"operation":"updated dog","changes":{"added":[],"removed":[],"edited":[["dog_name","Bret","Bret2"],["breed_type","Pit Bull Terrier","Japanese Tosa"],["colour","Brown","Brown2"],["sex","Male","Female"],["dog_date_of_birth","2012-07-14","2012-07-15"],["tattoo","","adfadsfd"],["microchip1","718040945227597","718040945227598"],["status","Exempt","Inactive"]]}}'
  }
}

const updateStatusDog = {
  specversion: '1.0',
  type: 'uk.gov.defra.ddi.event.update',
  source: 'aphw-ddi-portal',
  id: '393e9729-6dbc-4f2e-b1e2-2b02d21197b2',
  partitionKey: 'ED300001',
  time: '2024-04-12T10:30:24.113Z',
  subject: 'DDI Update dog',
  datacontenttype: 'text/json',
  data: {
    message: '{"actioningUser":{"username":"dev@test.com","displayname":"Developer"},"operation":"updated dog","changes":{"added":[],"removed":[],"edited":[["status","Inactive","Exempt"]]}}'
  }
}

const updateExemption = {
  specversion: '1.0',
  type: 'uk.gov.defra.ddi.event.update',
  source: 'aphw-ddi-portal',
  id: '5bc69bda-39f2-4385-a47c-b4e53844eacb',
  partitionKey: 'ED300001',
  time: '2024-04-12T10:31:41.976Z',
  subject: 'DDI Update exemption',
  datacontenttype: 'text/json',
  data: {
    message: '{"actioningUser":{"username":"dev@test.com","displayname":"Developer"},"operation":"updated exemption","changes":{"added":[],"removed":[],"edited":[["police_force","Essex Police","Avon and Somerset Constabulary"],["cdo_issued","2016-11-14","2018-11-14"],["cdo_expiry","2017-01-14","2018-01-14"]]}}'
  }
}

const updateDogDetailsFromNull = {
  specversion: '1.0',
  type: 'uk.gov.defra.ddi.event.update',
  source: 'aphw-ddi-portal',
  id: '7028ee25-babe-4213-9000-186c4da8df89',
  partitionKey: 'ED300003',
  time: '2024-04-12T10:27:40.632Z',
  subject: 'DDI Update dog',
  datacontenttype: 'text/json',
  data: {
    message: '{"actioningUser":{"username":"dev@test.com","displayname":"Developer"},"operation":"updated dog","changes":{"added":[],"removed":[],"edited":[["date_exported",null,"2024-01-01"],["date_stolen",null,"2024-01-01"],["date_untraceable",null,"2024-01-01"]]}}'
  }
}

const updateExemptionNull = {
  specversion: '1.0',
  type: 'uk.gov.defra.ddi.event.update',
  source: 'aphw-ddi-portal',
  id: '5bc69bda-39f2-4385-a47c-b4e53844eacb',
  partitionKey: 'ED300003',
  time: '2024-04-12T10:31:41.976Z',
  subject: 'DDI Update exemption',
  datacontenttype: 'text/json',
  data: {
    message: '{"actioningUser":{"username":"dev@test.com","displayname":"Developer"},"operation":"updated exemption","changes":{"added":[],"removed":[],"edited":[["certificate_issued",null,"2022-01-01"],["legislation_officer",null,"adfdfd"]]}}'
  }
}

const updatePersonDetails = {
  specversion: '1.0',
  type: 'uk.gov.defra.ddi.event.update',
  source: 'aphw-ddi-portal',
  id: 'd48baaea-d2bb-4498-bc99-2f6dc53d869e',
  partitionKey: 'P-B218-7D59',
  time: '2024-04-12T10:29:40.428Z',
  subject: 'DDI Update person',
  datacontenttype: 'text/json',
  data: {
    message: '{"actioningUser":{"username":"dev@test.com","displayname":"Developer"},"operation":"updated person","changes":{"added":[],"removed":[],"edited":[["firstName","Cristopher","Cristopher2"],["lastName","Dietrich","Dietrich2"],["address/addressLine1","3990 E Elm Street","3990 E Elm Street2"],["address/town","City51","City"],["address/postcode","KJ19 9GQ","KJ19 9GR"],["address/country","England","Wales"],["contacts/email","Wilbert_Weissnat@yahoo.com","Wilbert_Weissnat2@yahoo.com"],["contacts/primaryTelephone","1-662-480-8197 x1523","01234567890"]]}}'
  }
}

const updatePersonDetailsFromNull = {
  specversion: '1.0',
  type: 'uk.gov.defra.ddi.event.update',
  source: 'aphw-ddi-portal',
  id: 'd48baaea-d2bb-4498-bc99-2f6dc53d869e',
  partitionKey: 'P-B218-7D62',
  time: '2024-04-12T10:29:40.428Z',
  subject: 'DDI Update person',
  datacontenttype: 'text/json',
  data: {
    message: '{"actioningUser":{"username":"dev@test.com","displayname":"Developer"},"operation":"updated person","changes":{"added":[],"removed":[],"edited":[["birthDate",null,"1990-01-01"],["address/addressLine2",null,"adfadfdf"],["contacts/secondaryTelephone",null,"07890123456"]]}}'
  }
}

module.exports = {
  updateDogDetails,
  updateDogDetailsFromNull,
  updatePersonDetails,
  updatePersonDetailsFromNull,
  updateStatusDog,
  updateExemption,
  updateExemptionNull
}
