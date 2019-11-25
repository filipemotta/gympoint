import Student from "../models/Student";
import Plan from "../models/Plan";
import User from "../models/User";
import Enrollment from "../models/Enrollment";
import { parseISO, addMonths, format } from "date-fns";
import Mail from "../../lib/Mail";
import pt from "date-fns/locale";

class EnrollmentController {
  async index(req, res) {
    const enrollment = await Enrollment.findAll({
      where: {
        student_id: req.params.id
      },
      attributes: ["start_date", "end_date", "price"],
      include: [
        {
          model: Student,
          as: "student",
          attributes: ["name", "email"]
        },
        {
          model: Plan,
          as: "plan",
          attributes: ["title", "duration", "price"]
        }
      ]
    });

    return res.json(enrollment);
  }

  async store(req, res) {
    const { start_date, plan_id } = req.body;
    const student = await Student.findByPk(req.params.id);
    const plan = await Plan.findByPk(plan_id);

    if (!student) {
      return res.status(400).json({ error: "Student does not exist" });
    }
    if (!plan) {
      return res.status(400).json({ error: "Plan does not exist" });
    }
    const userLogged = await User.findByPk(req.userId);

    if (!userLogged) {
      return res
        .status(401)
        .json({ error: "You do not have permission to do this operation" });
    }

    const checkStudentEnrollment = await Enrollment.findOne({
      where: {
        student_id: student.id,
        plan_id: plan.id
      }
    });

    if (checkStudentEnrollment) {
      return res
        .status(400)
        .json({ error: "Student is already enrolled in this plan!" });
    }

    const start = parseISO(start_date);
    const end = addMonths(start, plan.duration);
    const total = plan.price * plan.duration;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: `Bem vindo a Gympoint ${student.name}`,
      template: "subscription",
      context: {
        student: student.name,
        plan: plan.title,
        value: total,
        start_date: start,
        end_date: end,
        date: format(start, "dd 'de' MMMM 'as' H:mm'h'", {
          locale: pt
        })
      }
    });

    const enrollment = await Enrollment.create({
      student_id: student.id,
      plan_id: plan.id,
      start_date: start,
      end_date: end,
      price: total
    });

    return res.json(enrollment);
  }

  async delete(req, res) {
    const enrollment = await Enrollment.findByPk(req.params.id);

    const userLogged = await User.findByPk(req.userId);

    if (!userLogged) {
      return res
        .status(401)
        .json({ error: "You do not permission to do this operation" });
    }

    await enrollment.destroy();

    return res.json({ information: `Plan deleted id: ${req.params.id}` });
  }

  async update(req, res) {
    const { start_date, plan_id } = req.body;
    const plan = await Plan.findByPk(plan_id);
    const enrollment = await Enrollment.findByPk(req.params.id);
    //  {
    //   include: [
    //     {
    //       model: Student,
    //       as: "student",
    //       attributes: ["name", "email"]
    //     },
    //     {
    //       model: Plan,
    //       as: "plan",
    //       attributes: ["title", "duration", "price"]
    //     }
    //   ]
    // }

    const userLogged = await User.findByPk(req.userId);

    if (!userLogged) {
      return res
        .status(401)
        .json({ error: "You do not permission to do this operation" });
    }

    const start = parseISO(start_date);
    const end = addMonths(start, plan.duration);
    const total = plan.price * plan.duration;
    const enroll = await enrollment.update({
      start_date: start,
      end_date: end,
      price: total
    });
    //console.log(enrollment.student.name);
    return res.json(enroll);
  }
}

export default new EnrollmentController();
