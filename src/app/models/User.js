import Sequelize, { Model } from "sequelize";
import bcrypt from "bcryptjs";

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password_virtual: Sequelize.VIRTUAL,
        password: Sequelize.STRING
      },
      { sequelize }
    );

    this.addHook("beforeSave", async user => {
      if (user.password_virtual) {
        user.password = await bcrypt.hash(user.password_virtual, 8);
      }
    });
    return this;
  }

  checkPassword(password_virtual) {
    return bcrypt.compare(password_virtual, this.password);
  }
}

export default User;
