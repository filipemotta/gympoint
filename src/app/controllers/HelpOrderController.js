import Student from "../models/Student";
import HelpOrder from "../models/HelpOrder";

class HelpOrderController {
  async store(req, res) {
    const student = await Student.findByPk(req.params.id);
    const { question } = req.body;
    if (!student) {
      return res.status(400).json({ error: "Student does not exist" });
    }
    console.log(req.params.id);
    const help_order = await HelpOrder.create({
      student_id: req.params.id,
      question: question
    });

    return res.json(help_order);
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    const student = await Student.findByPk(req.params.id);
    const helpOrders = await HelpOrder.findAll({
      where: {
        student_id: req.params.id
      },
      limit: 10,
      offset: (page - 1) * 10,
      attributes: ["question"],
      include: [
        {
          model: Student,
          as: "student",
          attributes: ["name"]
        }
      ]
    });

    if (!student) {
      return res.status(400).json({ error: "Student does not exist" });
    }

    return res.json(helpOrders);
  }
}

export default new HelpOrderController();
