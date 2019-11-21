import Student from "../models/Student";
import Checkin from "../models/Checkin";

class CheckinController {
  async store(req, res) {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(400).json({ error: "Student does not exist" });
    }

    const checkin = await Checkin.create({
      student_id: req.params.id
    });

    return res.json(checkin);
  }
}

export default new CheckinController();
