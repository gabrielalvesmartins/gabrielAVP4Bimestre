import * as authService from "../services/auth.service.js";
export const register = async (req, res, next) => { try { res.status(201).json(await authService.register(req.validated.body)); } catch (error) { next(error); } };
export const login = async (req, res, next) => { try { res.json(await authService.login(req.validated.body)); } catch (error) { next(error); } };
export const me = (req, res) => res.json({ user: req.user });
