import { Endpoint } from "../../../core/common/apiLink";
import { RequestService } from "../../utils/response";

class FolderService {
    async getFolder(setLoading: Function) {
        setLoading(true);
        try {
            const response = await RequestService.get(Endpoint.Folder.Get);
            return response;
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async getFolderbyId(id: string, keyword: string, setLoading: Function) {
        setLoading(true);
        try {
            const response = await RequestService.get(`${Endpoint.Folder.GetById}/${id}?keyword=${keyword}`);
            return response;
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async createFolder(data: any, setLoading: Function) {
        setLoading(true);
        try {
            const response = await RequestService.post(Endpoint.Folder.Create, data);
            return response;
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async updateFolder(id: string, data: any, setLoading: Function) {
        setLoading(true);
        try {
            const response = await RequestService.put(`${Endpoint.Folder.Update}/${id}`, data);
            return response;
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async deleteFolder(id: string, setLoading: Function) {
        setLoading(true);
        try {
            const response = await RequestService.delete(`${Endpoint.Folder.Delete}/${id}`);
            return response;
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async saveFolder(data: any, setLoading: Function) {
        setLoading(true);
        try {
            const response = await RequestService.post(Endpoint.Folder.Save, data);
            return response;
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
}

export default new FolderService();