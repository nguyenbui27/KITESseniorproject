import { Endpoint } from "../../../core/common/apiLink";
import { RequestService } from "../../utils/response";

class InspectorService {
    private extractError(error: any, fallback: string) {
        return (
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            fallback
        );
    }

    async getInspector(params: any, setLoading: Function) {
        setLoading(true);
        try {
            const response = await RequestService.get(Endpoint.Inspector.Get, params);
            return response;
        } catch (error: any) {
            console.log(error);
            throw new Error(this.extractError(error, 'Unable to load guardians'));
        } finally {
            setLoading(false);
        }
    }

    async createInspector(data: any, setLoading: Function) {
        setLoading(true);
        try {
            const response = await RequestService.post(Endpoint.Inspector.Create, data);
            return response;
        } catch (error: any) {
            console.error(error);
            throw new Error(this.extractError(error, 'Unable to create guardian'));
        } finally {
            setLoading(false);
        }
    }

    async updateInspector(id: string, data: any, setLoading: Function) {
        setLoading(true);
        try {
            const response = await RequestService.put(`${Endpoint.Inspector.Update}/${id}`, data);
            return response;
        } catch (error: any) {
            console.log(error);
            throw new Error(this.extractError(error, 'Unable to update guardian'));
        } finally {
            setLoading(false);
        }
    }

    async deleteInspector(id: string, setLoading: Function) {
        setLoading(true);
        try {
            const response = await RequestService.delete(`${Endpoint.Inspector.Delete}/${id}`);
            return response;
        } catch (error: any) {
            console.log(error);
            throw new Error(this.extractError(error, 'Unable to delete guardian'));
        } finally {
            setLoading(false);
        }
    }
}

export default new InspectorService();
