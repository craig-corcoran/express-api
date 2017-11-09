
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

describe('\n\n', function () {

  this.timeout(5000);

  let app;
  before(function () {
    app = require('../app');
  });

  // GET '/'
  it("should return service name when get req is made to /", async function () {
    const res = await chai.request(app).get('/');
    res.should.have.status(200);
    res.text.should.equal('Audit Data API');
  });

});