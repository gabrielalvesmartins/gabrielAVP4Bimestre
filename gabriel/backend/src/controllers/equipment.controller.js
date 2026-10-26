import * as service from "../services/equipment.service.js";
export const list = async (req, res, next) => { try { res.json({ equipments: await service.list() }); } catch (e) { next(e); } };
export const get = async (req, res, next) => { try { res.json({ equipment: await service.get(req.validated.params.id) }); } catch (e) { next(e); } };
export const create = async (req, res, next) => { try { res.status(201).json({ equipment: await service.create(req.validated.body) }); } catch (e) { next(e); } };
export const update = async (req, res, next) => { try { res.json({ equipment: await service.update(req.validated.params.id, req.validated.body) }); } catch (e) { next(e); } };
export const remove = async (req, res, next) => { try { await service.remove(req.validated.params.id); res.status(204).end(); } catch (e) { next(e); } };
