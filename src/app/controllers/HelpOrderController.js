import Student from "../models/Student";
import HelpOrder from "../models/HelpOrder";
import { format } from "date-fns";
import Mail from "../../lib/Mail";
import pt from "date-fns/locale";

class HelpOrderController {
  async store(req, res) {
    const student = await Student.findByPk(req.params.id);
    const { question } = req.body;
    if (!student) {
      return res.status(400).json({ error: "Student does not exist" });
    }

    const help_order = await HelpOrder.create({
      student_id: req.params.id,
      question: question
    });

    return res.json(help_order);
  }

  async update(req, res) {
    const helpOrder = await HelpOrder.findByPk(req.params.id, {
      include: [
        {
          model: Student,
          as: "student",
          attributes: ["name", "email"]
        }
      ]
    });
    const { answer } = req.body;

    const helpAnswer = await helpOrder.update({
      answer: answer,
      answer_at: new Date()
    });

    await Mail.sendMail({
      to: `${helpOrder.student.name} <${helpOrder.student.email}>`,
      subject: `Sua pergunta foi respondida ${helpOrder.student.name}`,
      template: "answer",
      context: {
        student: helpOrder.student.name,
        question: helpOrder.question,
        answer: answer,
        date: format(helpAnswer.answer_at, "dd 'de' MMMM 'as' H:mm'h'", {
          locale: pt
        })
      }
    });

    return res.json(helpAnswer);
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
