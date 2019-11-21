import * as Yup from "yup";
import Student from "../models/Student";
import User from "../models/User";

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      age: Yup.number().required(),
      weight: Yup.number().required(),
      height: Yup.number().required()
    });

    const userLogged = await User.findByPk(req.userId);

    if (!userLogged) {
      return res
        .status(401)
        .json({ error: "You do not permission to do this operation" });
    }

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "validations fails" });
    }

    const studentExist = await Student.findOne({
      where: { email: req.body.email }
    });

    if (studentExist) {
      return res.status(400).json({ error: "Student already exist !" });
    }

    const { id, name, email, age, weight, height } = await Student.create(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height
    });
  }

  async update(req, res) {
    const student = await Student.findByPk(req.params.id);
    const userLogged = await User.findByPk(req.userId);
    const { email } = req.body;

    if (!userLogged) {
      return res
        .status(401)
        .json({ error: "You do not permission to do this operation" });
    }

    if (email != student.email) {
      const studentExist = await Student.findOne({
        where: { email: email }
      });

      if (studentExist) {
        return res.status(400).json({ error: "Student already exist !" });
      }
    }

    const { id, name, email, age, weight, height } = await student.update(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height
    });
  }
}

export default new StudentController();
