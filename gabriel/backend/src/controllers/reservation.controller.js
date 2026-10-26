import * as service from "../services/reservation.service.js";
export const list = async (req, res, next) => { try { res.json({ reservations: await service.list(req.user) }); } catch (e) { next(e); } };
export const get = async (req, res, next) => { try { res.json({ reservation: await service.get(req.validated.params.id, req.user) }); } catch (e) { next(e); } };
export const create = async (req, res, next) => { try { res.status(201).json({ reservation: await service.create(req.validated.body, req.user) }); } catch (e) { next(e); } };
export const update = async (req, res, next) => { try { res.json({ reservation: await service.update(req.validated.params.id, req.validated.body, req.user) }); } catch (e) { next(e); } };
export const remove = async (req, res, next) => { try { res.json({ reservation: await service.remove(req.validated.params.id, req.user) }); } catch (e) { next(e); } };
