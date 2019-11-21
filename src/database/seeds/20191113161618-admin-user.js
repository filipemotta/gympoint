const bcrypt = require("bcryptjs");

module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      "users",
      [
        {
          name: "Administrator",
          email: "administrator@gympoint.com",
          password: bcrypt.hashSync("123456", 8),
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      {}
    );
  },

  down: () => {}
};
