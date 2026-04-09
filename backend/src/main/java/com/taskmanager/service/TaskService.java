package com.taskmanager.service;

import com.taskmanager.entity.Task;
import com.taskmanager.entity.User;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    private User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public List<Task> getUserTasks(String username) {
        return taskRepository.findByUserOrderByCreatedAtDesc(getUser(username));
    }

    public Task createTask(String username, Task task) {
        task.setUser(getUser(username));
        return taskRepository.save(task);
    }

    public Task updateTask(String username, Long id, Task updated) {
        Task task = taskRepository.findById(id).orElseThrow();
        if (!task.getUser().getUsername().equals(username)) throw new RuntimeException("Forbidden");
        task.setTitle(updated.getTitle());
        task.setDescription(updated.getDescription());
        task.setStatus(updated.getStatus());
        task.setPriority(updated.getPriority());
        task.setDueDate(updated.getDueDate());
        return taskRepository.save(task);
    }

    public void deleteTask(String username, Long id) {
        Task task = taskRepository.findById(id).orElseThrow();
        if (!task.getUser().getUsername().equals(username)) throw new RuntimeException("Forbidden");
        taskRepository.delete(task);
    }
}
