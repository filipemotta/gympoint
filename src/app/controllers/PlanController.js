import * as Yup from "yup";
import Plan from "../models/Plan";
import User from "../models/User";

class PlanController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const plans = await Plan.findAll({
      limit: 10,
      offset: (page - 1) * 10,
      attributes: ["title", "duration", "price"]
    });

    return res.json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required()
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

    const planExist = await Plan.findOne({
      where: { title: req.body.title }
    });

    if (planExist) {
      return res.status(400).json({
        error: "Already exist a plan with this name, please try again !"
      });
    }

    const { id, title, duration, price } = await Plan.create(req.body);

    return res.json({
      id,
      title,
      duration,
      price
    });
  }

  async update(req, res) {
    const plan = await Plan.findByPk(req.params.id);

    const userLogged = await User.findByPk(req.userId);

    if (!userLogged) {
      return res
        .status(401)
        .json({ error: "You do not permission to do this operation" });
    }

    const { id, title, duration, price } = await plan.update(req.body);

    return res.json({
      id,
      title,
      duration,
      price
    });
  }

  async delete(req, res) {
    const plan = await Plan.findByPk(req.params.id);

    const userLogged = await User.findByPk(req.userId);

    if (!userLogged) {
      return res
        .status(401)
        .json({ error: "You do not permission to do this operation" });
    }

    await plan.destroy();

    return res.json({ information: `Plan deleted id: ${req.params.id}` });
  }
}

export default new PlanController();
