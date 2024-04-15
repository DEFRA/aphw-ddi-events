
const createCdoEventV1WithDogs = {
  specversion: '1.0',
  type: 'uk.gov.defra.ddi.event.create',
  source: 'aphw-ddi-portal',
  id: 'b7c16e55-cab2-4e00-869e-edee4e58f33e',
  partitionKey: 'ED300002',
  time: '2024-04-12T10:36:58.311Z',
  subject: 'DDI Create cdo',
  datacontenttype: 'text/json',
  data: {
    message: '{"actioningUser":{"username":"internal-user","displayname":"User, Internal"},"operation":"created cdo","created":{"owner":{"id":10710,"first_name":"Malinda","last_name":"Rodriguez","birth_date":"2024-04-12","person_reference":"P-B218-7D58","organisation_id":null,"address":{"id":10717,"address_line_1":"792 Greenfelder Path","address_line_2":"Anywhere Estate","town":"City of London","postcode":"S1 1AA","county":null,"country_id":3,"country":{"country":"Wales"}}},"dogs":[{"id":300002,"dog_reference":"4f37d258-b6c0-466a-8004-78254905eb24","index_number":"ED300002","dog_breed_id":1,"status_id":4,"name":"Rex170","birth_date":null,"death_date":null,"tattoo":null,"colour":null,"sex":null,"exported_date":null,"stolen_date":null,"untraceable_date":null,"dog_breed":{"breed":"XL Bully"},"status":{"id":4,"status":"Interim exempt","status_type":"STANDARD"},"existingDog":false,"registration":{"id":7232,"dog_id":300308,"status_id":1,"police_force_id":1,"court_id":1,"exemption_order_id":1,"cdo_issued":"2023-10-10","cdo_expiry":"2023-12-10","time_limit":null,"certificate_issued":null,"legislation_officer":"Sidney Lewis","application_fee_paid":null,"neutering_confirmation":null,"microchip_verification":null,"joined_exemption_scheme":"2023-12-10","withdrawn":null,"typed_by_dlo":null,"microchip_deadline":null,"neutering_deadline":null,"removed_from_cdo_process":null,"deleted_at":null,"created_on":"2024-04-12T10:36:58.306Z","updated_at":"2024-04-12T10:36:58.306Z","police_force":{"name":"Avon and Somerset Constabulary"},"court":{"name":"Aberystwyth Justice Centre"}}}]}}'
  }
}

const createCdoV2WithSingleDog = {
  specversion: '1.0',
  type: 'uk.gov.defra.ddi.event.create',
  source: 'aphw-ddi-portal',
  id: 'b7c16e55-cab2-4e00-869e-edee4e58f33e',
  partitionKey: 'ED300004',
  time: '2024-04-12T10:36:58.311Z',
  subject: 'DDI Create cdo',
  datacontenttype: 'text/json',
  data: {
    message: '{"actioningUser":{"username":"internal-user","displayname":"User, Internal"},"operation":"created cdo","created":{"owner":{"id":10710,"first_name":"Malinda","last_name":"Rodriguez","birth_date":"2024-04-12","person_reference":"P-B218-7D60","organisation_id":null,"address":{"id":10717,"address_line_1":"792 Greenfelder Path","address_line_2":"Anywhere Estate","town":"City of London","postcode":"S1 1AA","county":null,"country_id":3,"country":{"country":"Wales"}}},"dog":{"id":300002,"dog_reference":"4f37d258-b6c0-466a-8004-78254905eb24","index_number":"ED300004","dog_breed_id":1,"status_id":4,"name":"Rex170","birth_date":null,"death_date":null,"tattoo":null,"colour":null,"sex":null,"exported_date":null,"stolen_date":null,"untraceable_date":null,"dog_breed":{"breed":"XL Bully"},"status":{"id":4,"status":"Interim exempt","status_type":"STANDARD"},"existingDog":false,"registration":{"id":7232,"dog_id":300308,"status_id":1,"police_force_id":1,"court_id":1,"exemption_order_id":1,"cdo_issued":"2023-10-10","cdo_expiry":"2023-12-10","time_limit":null,"certificate_issued":null,"legislation_officer":"Sidney Lewis","application_fee_paid":null,"neutering_confirmation":null,"microchip_verification":null,"joined_exemption_scheme":"2023-12-10","withdrawn":null,"typed_by_dlo":null,"microchip_deadline":null,"neutering_deadline":null,"removed_from_cdo_process":null,"deleted_at":null,"created_on":"2024-04-12T10:36:58.306Z","updated_at":"2024-04-12T10:36:58.306Z","police_force":{"name":"Avon and Somerset Constabulary"},"court":{"name":"Aberystwyth Justice Centre"}}}}}'
  }
}

const createCdoV3WithSingleDog = {
  specversion: '1.0',
  type: 'uk.gov.defra.ddi.event.create',
  source: 'aphw-ddi-portal',
  id: 'b7c16e55-cab2-4e00-869e-edee4e58f33e',
  partitionKey: 'ED300005',
  time: '2024-04-12T10:36:58.311Z',
  subject: 'DDI Create cdo',
  datacontenttype: 'text/json',
  data: {
    message: '{"actioningUser":{"username":"internal-user","displayname":"User, Internal"},"operation":"created cdo","created":{"owner":{"id":10710,"first_name":"Malinda","last_name":"Rodriguez","birth_date":"2024-04-12","person_reference":"P-B218-7D61","organisation_id":null,"address":{"id":10717,"address_line_1":"792 Greenfelder Path","address_line_2":"Anywhere Estate","town":"City of London","postcode":"S1 1AA","county":null,"country_id":3,"country":{"country":"Wales"}}},"dog":{"id":300002,"dog_reference":"4f37d258-b6c0-466a-8004-78254905eb24","index_number":"ED300004","dog_breed_id":1,"status_id":4,"name":"Rex170","birth_date":null,"death_date":null,"tattoo":null,"colour":null,"sex":null,"exported_date":null,"stolen_date":null,"untraceable_date":null,"dog_breed":{"breed":"XL Bully"},"status":{"id":4,"status":"Interim exempt","status_type":"STANDARD"},"existingDog":false,"registration":{"id":7232,"dog_id":300308,"status_id":1,"police_force_id":1,"court_id":1,"exemption_order_id":1,"cdo_issued":"2023-10-10","cdo_expiry":"2023-12-10","time_limit":null,"certificate_issued":null,"legislation_officer":"Sidney Lewis","application_fee_paid":null,"neutering_confirmation":null,"microchip_verification":null,"joined_exemption_scheme":"2023-12-10","withdrawn":null,"typed_by_dlo":null,"microchip_deadline":null,"neutering_deadline":null,"removed_from_cdo_process":null,"deleted_at":null,"created_at":"2024-04-12T10:36:58.306Z","updated_at":"2024-04-12T10:36:58.306Z","police_force":{"name":"Avon and Somerset Constabulary"},"court":{"name":"Aberystwyth Justice Centre"}}}}}'
  }
}

module.exports = {
  createCdoEventV1WithDogs,
  createCdoV2WithSingleDog,
  createCdoV3WithSingleDog
}
