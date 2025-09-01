import { taskService } from "./taskService";
import { toast } from "react-toastify";
import React from "react";

export const categoryService = {
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
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "task_count_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "ASC"}]
      };

      const response = await apperClient.fetchRecords("category_c", params);

      if (!response.success) {
        console.error("Error fetching categories:", response.message);
        toast.error(response.message);
        return [];
      }

      if (!response?.data?.length) {
        return [];
      }

      // Update task counts dynamically
      const tasks = await taskService.getAll();
      const updatedCategories = response.data.map(category => ({
        Id: category.Id,
        name: category.Name || '',
        color: category.color_c || '#5B4FE8',
        icon: category.icon_c || 'Folder',
        taskCount: tasks.filter(task => task.categoryId === category.Id && !task.completed).length
      }));

      return updatedCategories;
    } catch (error) {
      console.error("Error fetching categories:", error?.response?.data?.message || error);
      toast.error("Failed to fetch categories");
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
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "task_count_c"}}
        ]
      };

      const response = await apperClient.getRecordById("category_c", parseInt(id), params);

      if (!response?.data) {
        return null;
      }

      const category = response.data;
      
      // Update task count dynamically
      const tasks = await taskService.getAll();
      const taskCount = tasks.filter(task => task.categoryId === parseInt(id) && !task.completed).length;

      return {
        Id: category.Id,
        name: category.Name || '',
        color: category.color_c || '#5B4FE8',
        icon: category.icon_c || 'Folder',
        taskCount: taskCount
      };
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(categoryData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [
          {
            Name: categoryData.name || '',
            color_c: categoryData.color || '#5B4FE8',
            icon_c: categoryData.icon || 'Folder',
            task_count_c: 0
          }
        ]
      };

      const response = await apperClient.createRecord("category_c", params);

      if (!response.success) {
        console.error("Error creating category:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} categories:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const createdCategory = successful[0].data;
          return {
            Id: createdCategory.Id,
            name: createdCategory.Name || '',
            color: createdCategory.color_c || '#5B4FE8',
            icon: createdCategory.icon_c || 'Folder',
            taskCount: 0
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating category:", error?.response?.data?.message || error);
      toast.error("Failed to create category");
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
      if (updates.name !== undefined) updateData.Name = updates.name;
      if (updates.color !== undefined) updateData.color_c = updates.color;
      if (updates.icon !== undefined) updateData.icon_c = updates.icon;
      if (updates.taskCount !== undefined) updateData.task_count_c = updates.taskCount;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord("category_c", params);

      if (!response.success) {
        console.error("Error updating category:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} categories:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const updatedCategory = successful[0].data;
          return {
            Id: updatedCategory.Id,
            name: updatedCategory.Name || '',
            color: updatedCategory.color_c || '#5B4FE8',
            icon: updatedCategory.icon_c || 'Folder',
            taskCount: updatedCategory.task_count_c || 0
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating category:", error?.response?.data?.message || error);
      toast.error("Failed to update category");
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

      const response = await apperClient.deleteRecord("category_c", params);

      if (!response.success) {
        console.error("Error deleting category:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} categories:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting category:", error?.response?.data?.message || error);
      toast.error("Failed to delete category");
      return false;
}
  }
};