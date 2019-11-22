import Student from "../models/Student";
import Checkin from "../models/Checkin";
import { Op } from "sequelize";
import { endOfWeek, startOfWeek } from "date-fns";

class CheckinController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const student = await Student.findByPk(req.params.id);
    const checkins = await Checkin.findAll({
      where: {
        student_id: req.params.id
      },
      limit: 10,
      offset: (page - 1) * 10,
      attributes: ["created_at"],
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

    return res.json(checkins);
  }

  async store(req, res) {
    const student = await Student.findByPk(req.params.id);
    const checkinUserDays = await Checkin.findAll({
      where: {
        student_id: req.params.id,
        created_at: {
          [Op.between]: [startOfWeek(new Date()), endOfWeek(new Date())]
        }
      }
    });

    if (!student) {
      return res.status(400).json({ error: "Student does not exist" });
    }

    if (checkinUserDays.length > 5) {
      res.status(400).json({
        error: "Student cannot checkin more than 5 times in a 7 day period"
      });
    }

    const checkin = await Checkin.create({
      student_id: req.params.id
    });

    return res.json(checkin);
  }
}

export default new CheckinController();
