package com.taskmanager.controller;

import com.taskmanager.entity.Task;
import com.taskmanager.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Tag(name = "Tasks", description = "Task management endpoints")
public class TaskController {

    private final TaskService taskService;

    @GetMapping("/my")
    @Operation(summary = "Get all tasks for current user")
    public ResponseEntity<List<Task>> getMyTasks(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(taskService.getUserTasks(user.getUsername()));
    }

    @PostMapping
    @Operation(summary = "Create a new task")
    public ResponseEntity<Task> createTask(@AuthenticationPrincipal UserDetails user,
                                           @RequestBody Task task) {
        return ResponseEntity.ok(taskService.createTask(user.getUsername(), task));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing task")
    public ResponseEntity<Task> updateTask(@AuthenticationPrincipal UserDetails user,
                                           @PathVariable Long id, @RequestBody Task task) {
        return ResponseEntity.ok(taskService.updateTask(user.getUsername(), id, task));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a task")
    public ResponseEntity<Void> deleteTask(@AuthenticationPrincipal UserDetails user,
                                           @PathVariable Long id) {
        taskService.deleteTask(user.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
