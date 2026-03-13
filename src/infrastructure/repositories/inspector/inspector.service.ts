import { Endpoint } from "../../../core/common/apiLink";
import { RequestService } from "../../utils/response";

class InspectorService {
    async getInspector(params: any, setLoading: Function) {
        setLoading(true);
        try {
            const response = await RequestService.get(Endpoint.Inspector.Get, params);
            return response;
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async createInspector(data: any, setLoading: Function) {
        setLoading(true);
        try {
            const response = await RequestService.post(Endpoint.Inspector.Create, data);
            return response;
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async updateInspector(id: string, data: any, setLoading: Function) {
        setLoading(true);
        try {
            const response = await RequestService.put(`${Endpoint.Inspector.Update}/${id}`, data);
            return response;
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async deleteInspector(id: string, setLoading: Function) {
        setLoading(true);
        try {
            const response = await RequestService.delete(`${Endpoint.Inspector.Delete}/${id}`);
            return response;
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
}

export default new InspectorService();
