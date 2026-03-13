import { Endpoint } from "../../../core/common/apiLink";
import { RequestService } from "../../utils/response";

class UserService {
    async getChild(params: any, setLoading: Function) {
        setLoading(true);
        try {
            const response = await RequestService.get(Endpoint.User.MyChild, params);
            return response;
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async getParent(setLoading: Function) {
        setLoading(true);
        try {
            const response = await RequestService.get(Endpoint.User.MyParent);
            return response;
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async createUser(data: any, setLoading: Function) {
        setLoading(true);
        try {
            const response = await RequestService.post(Endpoint.User.Create, data);
            return response;
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async updateUser(id: string, data: any, setLoading: Function) {
        setLoading(true);
        try {
            const response = await RequestService.put(`${Endpoint.User.Update}/${id}`, data);
            return response;
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async deleteUser(id: string, setLoading: Function) {
        setLoading(true);
        try {
            const response = await RequestService.delete(`${Endpoint.User.Delete}/${id}`);
            return response;
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async getLocation(setLoading: Function) {
        setLoading(true);
        try {
            const response = await RequestService.get(Endpoint.Notification.GetLocation);
            return response;
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async shareLocation(data: any, setLoading: Function) {
        setLoading(true);
        try {
            const response = await RequestService.post(Endpoint.Notification.Location, data);
            return response;
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async sharePin(data: any, setLoading: Function) {
        setLoading(true);
        try {
            const response = await RequestService.post(Endpoint.Notification.Pin, data);
            return response;
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async notificationSOS(setLoading: Function) {
        setLoading(true);
        try {
            const response = await RequestService.post(Endpoint.Notification.SOS, {});
            return response;
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
}

export default new UserService();
