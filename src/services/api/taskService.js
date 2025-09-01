import { toast } from 'react-toastify';

export const taskService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_id_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords("task_c", params);

      if (!response.success) {
        console.error("Error fetching tasks:", response.message);
        toast.error(response.message);
        return [];
      }

      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c || '',
        description: task.description_c || '',
        categoryId: task.category_id_c?.Id || task.category_id_c,
        priority: task.priority_c || 'medium',
        dueDate: task.due_date_c,
        completed: task.completed_c || false,
        createdAt: task.created_at_c,
        completedAt: task.completed_at_c
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      toast.error("Failed to fetch tasks");
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_id_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}}
        ]
      };

      const response = await apperClient.getRecordById("task_c", parseInt(id), params);

      if (!response?.data) {
        return null;
      }

      const task = response.data;
      return {
        Id: task.Id,
        title: task.title_c || '',
        description: task.description_c || '',
        categoryId: task.category_id_c?.Id || task.category_id_c,
        priority: task.priority_c || 'medium',
        dueDate: task.due_date_c,
        completed: task.completed_c || false,
        createdAt: task.created_at_c,
        completedAt: task.completed_at_c
      };
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [
          {
            title_c: taskData.title || '',
            description_c: taskData.description || '',
            category_id_c: parseInt(taskData.categoryId),
            priority_c: taskData.priority || 'medium',
            due_date_c: taskData.dueDate,
            completed_c: taskData.completed || false,
            created_at_c: new Date().toISOString(),
            completed_at_c: taskData.completed ? new Date().toISOString() : null
          }
        ]
      };

      const response = await apperClient.createRecord("task_c", params);

      if (!response.success) {
        console.error("Error creating task:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const createdTask = successful[0].data;
          return {
            Id: createdTask.Id,
            title: createdTask.title_c || '',
            description: createdTask.description_c || '',
            categoryId: createdTask.category_id_c?.Id || createdTask.category_id_c,
            priority: createdTask.priority_c || 'medium',
            dueDate: createdTask.due_date_c,
            completed: createdTask.completed_c || false,
            createdAt: createdTask.created_at_c,
            completedAt: createdTask.completed_at_c
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
      toast.error("Failed to create task");
      return null;
    }
  },

  async update(id, updates) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateData = {
        Id: parseInt(id)
      };

      // Map updates to database field names
      if (updates.title !== undefined) updateData.title_c = updates.title;
      if (updates.description !== undefined) updateData.description_c = updates.description;
      if (updates.categoryId !== undefined) updateData.category_id_c = parseInt(updates.categoryId);
      if (updates.priority !== undefined) updateData.priority_c = updates.priority;
      if (updates.dueDate !== undefined) updateData.due_date_c = updates.dueDate;
      if (updates.completed !== undefined) {
        updateData.completed_c = updates.completed;
        if (updates.completed) {
          updateData.completed_at_c = new Date().toISOString();
        } else {
          updateData.completed_at_c = null;
        }
      }

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord("task_c", params);

      if (!response.success) {
        console.error("Error updating task:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const updatedTask = successful[0].data;
          return {
            Id: updatedTask.Id,
            title: updatedTask.title_c || '',
            description: updatedTask.description_c || '',
            categoryId: updatedTask.category_id_c?.Id || updatedTask.category_id_c,
            priority: updatedTask.priority_c || 'medium',
            dueDate: updatedTask.due_date_c,
            completed: updatedTask.completed_c || false,
            createdAt: updatedTask.created_at_c,
            completedAt: updatedTask.completed_at_c
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error);
      toast.error("Failed to update task");
      return null;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord("task_c", params);

      if (!response.success) {
        console.error("Error deleting task:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error);
      toast.error("Failed to delete task");
      return false;
    }
  },

  async getByCategory(categoryId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_id_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}}
        ],
        where: [{"FieldName": "category_id_c", "Operator": "EqualTo", "Values": [parseInt(categoryId)]}],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords("task_c", params);

      if (!response.success) {
        console.error("Error fetching tasks by category:", response.message);
        return [];
      }

      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c || '',
        description: task.description_c || '',
        categoryId: task.category_id_c?.Id || task.category_id_c,
        priority: task.priority_c || 'medium',
        dueDate: task.due_date_c,
        completed: task.completed_c || false,
        createdAt: task.created_at_c,
        completedAt: task.completed_at_c
      }));
    } catch (error) {
      console.error("Error fetching tasks by category:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getByStatus(completed) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_id_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}}
        ],
        where: [{"FieldName": "completed_c", "Operator": "EqualTo", "Values": [completed]}],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords("task_c", params);

      if (!response.success) {
        console.error("Error fetching tasks by status:", response.message);
        return [];
      }

      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c || '',
        description: task.description_c || '',
        categoryId: task.category_id_c?.Id || task.category_id_c,
        priority: task.priority_c || 'medium',
        dueDate: task.due_date_c,
        completed: task.completed_c || false,
        createdAt: task.created_at_c,
        completedAt: task.completed_at_c
      }));
    } catch (error) {
      console.error("Error fetching tasks by status:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getByPriority(priority) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_id_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}}
        ],
        where: [{"FieldName": "priority_c", "Operator": "EqualTo", "Values": [priority]}],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords("task_c", params);

      if (!response.success) {
        console.error("Error fetching tasks by priority:", response.message);
        return [];
      }

      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c || '',
        description: task.description_c || '',
        categoryId: task.category_id_c?.Id || task.category_id_c,
        priority: task.priority_c || 'medium',
        dueDate: task.due_date_c,
        completed: task.completed_c || false,
        createdAt: task.created_at_c,
        completedAt: task.completed_at_c
      }));
    } catch (error) {
      console.error("Error fetching tasks by priority:", error?.response?.data?.message || error);
      return [];
    }
  }
};